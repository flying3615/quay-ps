package com.centling.qps.service;

import com.centling.qps.QuayPsApp;
import com.centling.qps.domain.Authority;
import com.centling.qps.domain.User;
import com.centling.qps.repository.UserRepository;
import java.time.ZonedDateTime;
import com.centling.qps.service.util.RandomUtil;
import java.time.LocalDate;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.*;

/**
 * Test class for the UserResource REST controller.
 *
 * @see UserService
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = QuayPsApp.class)
@WebAppConfiguration
@IntegrationTest
@Transactional
public class UserServiceIntTest {

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserService userService;

    @Test
    public void assertThatUserMustExistToResetPassword() {
        Optional<User> maybeUser = userService.requestPasswordReset("john.doe@localhost");
        assertThat(maybeUser.isPresent()).isFalse();

        maybeUser = userService.requestPasswordReset("admin@localhost");
        assertThat(maybeUser.isPresent()).isTrue();

        assertThat(maybeUser.get().getEmail()).isEqualTo("admin@localhost");
        assertThat(maybeUser.get().getResetDate()).isNotNull();
        assertThat(maybeUser.get().getResetKey()).isNotNull();
    }

    @Test
    public void assertThatOnlyActivatedUserCanRequestPasswordReset() {
        User user = userService.createUserInformation("johndoe", "johndoe", "John", "Doe", "john.doe@localhost", "en-US");
        Optional<User> maybeUser = userService.requestPasswordReset("john.doe@localhost");
        assertThat(maybeUser.isPresent()).isFalse();
        userRepository.delete(user);
    }

    @Test
    public void assertThatResetKeyMustNotBeOlderThan24Hours() {
        User user = userService.createUserInformation("johndoe", "johndoe", "John", "Doe", "john.doe@localhost", "en-US");

        ZonedDateTime daysAgo = ZonedDateTime.now().minusHours(25);
        String resetKey = RandomUtil.generateResetKey();
        user.setActivated(true);
        user.setResetDate(daysAgo);
        user.setResetKey(resetKey);

        userRepository.save(user);

        Optional<User> maybeUser = userService.completePasswordReset("johndoe2", user.getResetKey());

        assertThat(maybeUser.isPresent()).isFalse();

        userRepository.delete(user);
    }

    @Test
    public void assertThatResetKeyMustBeValid() {
        User user = userService.createUserInformation("johndoe", "johndoe", "John", "Doe", "john.doe@localhost", "en-US");

        ZonedDateTime daysAgo = ZonedDateTime.now().minusHours(25);
        user.setActivated(true);
        user.setResetDate(daysAgo);
        user.setResetKey("1234");
        userRepository.save(user);
        Optional<User> maybeUser = userService.completePasswordReset("johndoe2", user.getResetKey());
        assertThat(maybeUser.isPresent()).isFalse();
        userRepository.delete(user);
    }

    @Test
    public void assertThatUserCanResetPassword() {
        User user = userService.createUserInformation("johndoe", "johndoe", "John", "Doe", "john.doe@localhost", "en-US");
        String oldPassword = user.getPassword();
        ZonedDateTime daysAgo = ZonedDateTime.now().minusHours(2);
        String resetKey = RandomUtil.generateResetKey();
        user.setActivated(true);
        user.setResetDate(daysAgo);
        user.setResetKey(resetKey);
        userRepository.save(user);
        Optional<User> maybeUser = userService.completePasswordReset("johndoe2", user.getResetKey());
        assertThat(maybeUser.isPresent()).isTrue();
        assertThat(maybeUser.get().getResetDate()).isNull();
        assertThat(maybeUser.get().getResetKey()).isNull();
        assertThat(maybeUser.get().getPassword()).isNotEqualTo(oldPassword);

        userRepository.delete(user);
    }

    @Test
    public void testFindNotActivatedUsersByCreationDateBefore() {
        userService.removeNotActivatedUsers();
        ZonedDateTime now = ZonedDateTime.now();
        List<User> users = userRepository.findAllByActivatedIsFalseAndCreatedDateBefore(now.minusDays(3));
        assertThat(users).isEmpty();
    }


    @Test
    public void testChangeUserRoles() {
        User u = userService.getUserWithAuthoritiesByLogin("admin").get();
        assertThat(u).isNotNull();
        Authority authority_admin = new Authority();
        authority_admin.setName("ROLE_ADMIN");
        assertThat(u.getAuthorities().equals(authority_admin));

        List<String> role_names = new ArrayList();

        role_names.add("ROLE_USER");
        role_names.add("ROLE_FINANCE");

        userService.modifyUserRoles(u.getId(),role_names);

        u = userService.getUserWithAuthoritiesByLogin("admin").get();
        List<String> new_roles = u.getAuthorities().stream().map(auth->auth.getName()).collect(Collectors.toList());
        assertThat(new_roles).contains("ROLE_USER");
        assertThat(new_roles).contains("ROLE_FINANCE");

    }

}
