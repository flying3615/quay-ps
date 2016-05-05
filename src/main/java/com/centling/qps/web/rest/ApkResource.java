package com.centling.qps.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.centling.qps.domain.Apk;
import com.centling.qps.repository.ApkRepository;
import com.centling.qps.web.rest.util.HeaderUtil;
import com.centling.qps.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PreDestroy;
import javax.inject.Inject;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static java.nio.file.StandardWatchEventKinds.ENTRY_CREATE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_DELETE;
import static java.nio.file.StandardWatchEventKinds.OVERFLOW;

/**
 * REST controller for managing Apk.
 */
@RestController
@RequestMapping("/api")
public class ApkResource {

    private final Logger log = LoggerFactory.getLogger(ApkResource.class);

    @Inject
    private ApkRepository apkRepository;



    /**
     * POST  /apks : Create a new apk.
     *
     * @param apk the apk to create
     * @return the ResponseEntity with status 201 (Created) and with body the new apk, or with status 400 (Bad Request) if the apk has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/apks",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Apk> createApk(@RequestBody Apk apk) throws URISyntaxException {
        log.debug("REST request to save Apk : {}", apk);
        if (apk.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("apk", "idexists", "A new apk cannot already have an ID")).body(null);
        }
        Apk result = apkRepository.save(apk);
        return ResponseEntity.created(new URI("/api/apks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("apk", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /apks : Updates an existing apk.
     *
     * @param apk the apk to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated apk,
     * or with status 400 (Bad Request) if the apk is not valid,
     * or with status 500 (Internal Server Error) if the apk couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/apks",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Apk> updateApk(@RequestBody Apk apk) throws URISyntaxException {
        log.debug("REST request to update Apk : {}", apk);
        if (apk.getId() == null) {
            return createApk(apk);
        }
        Apk result = apkRepository.save(apk);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("apk", apk.getId().toString()))
            .body(result);
    }

    /**
     * GET  /apks : get all the apks.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of apks in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/apks",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Apk>> getAllApks(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Apks");
        Page<Apk> page = apkRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/apks");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /apks/:id : get the "id" apk.
     *
     * @param id the id of the apk to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the apk, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/apks/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Apk> getApk(@PathVariable Long id) {
        log.debug("REST request to get Apk : {}", id);
        Apk apk = apkRepository.findOne(id);
        return Optional.ofNullable(apk)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /apks/:id : delete the "id" apk.
     *
     * @param id the id of the apk to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/apks/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteApk(@PathVariable Long id) {
        log.debug("REST request to delete Apk : {}", id);
        apkRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("apk", id.toString())).build();
    }




}
