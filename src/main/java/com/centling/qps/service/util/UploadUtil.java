package com.centling.qps.service.util;

import com.centling.qps.async.ExceptionHandlingAsyncTaskExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.PreDestroy;
import javax.inject.Inject;
import java.io.File;
import java.nio.file.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static java.nio.file.StandardWatchEventKinds.ENTRY_CREATE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_DELETE;
import static java.nio.file.StandardWatchEventKinds.OVERFLOW;

/**
 * Created by centling on 2016/5/5.
 */
@Component
public class UploadUtil {


    private final Logger log = LoggerFactory.getLogger(UploadUtil.class);


    @Inject
    SimpMessagingTemplate brokerMessagingTemplate;

    @Inject
    ExceptionHandlingAsyncTaskExecutor executor;


    final String APP_CLIENT_TOPIC = "/topic/app_upload";

    public void monitorFileChanges(String monitoredPath) {

        //init upload dir
        File newFile = new File(monitoredPath);
        if (!newFile.exists()) {
            newFile.mkdirs();
        }

        executor.execute(() -> {
            try {
                log.debug("in monitor file change thread");
                WatchService watcher = FileSystems.getDefault().newWatchService();
                Path dir = Paths.get(monitoredPath);
                WatchKey key = null;

                key = dir.register(watcher,
                    ENTRY_DELETE,
                    ENTRY_CREATE);

                for (; ; ) {
                    key = watcher.take();
                    for (WatchEvent<?> event : key.pollEvents()) {
                        WatchEvent.Kind<Path> kind = (WatchEvent.Kind<Path>) event.kind();
                        Path newPath = (Path) event.context();
                        if (kind.equals(OVERFLOW)) {
                            continue;
                        } else if (kind.equals(ENTRY_CREATE)) {
                            sendMessage(APP_CLIENT_TOPIC, "New path created:${newPath.toString()}");
                        } else if (kind.equals(ENTRY_DELETE)) {
                            sendMessage(APP_CLIENT_TOPIC, "Old path deleted:${newPath.toString()}");
                        }
                    }
                    if (!key.reset()) {
                        break; //loop
                    }
                }
                watcher.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

//    @PreDestroy
//    void shutdown() {
//        executor.shutdownNow();
//    }


    private void sendMessage(String topic, String message) {
        log.debug("send topic @ ${topic} and message=${message}");
        brokerMessagingTemplate.convertAndSend(topic, message);
    }
}
