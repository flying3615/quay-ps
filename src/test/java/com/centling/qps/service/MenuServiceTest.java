package com.centling.qps.service;

import com.centling.qps.QuayPsApp;
import com.centling.qps.domain.Authority;
import com.centling.qps.domain.Menu;
import com.centling.qps.repository.AuthorityRepository;
import com.centling.qps.repository.MenuRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

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
public class MenuServiceTest {

    @Inject
    private MenuService menuService;

    @Inject
    private MenuRepository menuRepository;

    @Inject
    private AuthorityRepository authorityRepository;

    private Menu child_menu1;
    private Menu child_menu2;
    private Menu child_menu3;
    private Menu parent_menu;

    private static final String DEFAULT_NAME1 = "menu1";
    private static final String DEFAULT_NAME2 = "menu2";
    private static final String DEFAULT_NAME3 = "menu3";
    private static final String DEFAULT_NAME_PARENT = "parent";

    private static final String DEFAULT_URL1 = "url1";
    private static final String DEFAULT_URL2 = "url2";
    private static final String DEFAULT_URL3 = "url3";
    private static final String DEFAULT_URL_PARENT = "parent_url";

    private static final Long DEFAULT_ORDER1 = 1L;
    private static final Long DEFAULT_ORDER2 = 2L;
    private static final Long DEFAULT_ORDER3 = 3L;
    private static final Long DEFAULT_ORDER_PARENT = 4L;


    @Before
    public void initTest() {
        child_menu1 = new Menu();
        child_menu1.setName(DEFAULT_NAME1);
        child_menu1.setUrl(DEFAULT_URL1);
        child_menu1.setOrder_no(DEFAULT_ORDER1);


        child_menu2 = new Menu();
        child_menu2.setName(DEFAULT_NAME2);
        child_menu2.setUrl(DEFAULT_URL2);
        child_menu2.setOrder_no(DEFAULT_ORDER2);

        child_menu3 = new Menu();
        child_menu3.setName(DEFAULT_NAME3);
        child_menu3.setUrl(DEFAULT_URL3);
        child_menu3.setOrder_no(DEFAULT_ORDER3);

        parent_menu = new Menu();
        parent_menu.setName(DEFAULT_NAME_PARENT);
        parent_menu.setUrl(DEFAULT_URL_PARENT);
        parent_menu.setOrder_no(DEFAULT_ORDER_PARENT);

        parent_menu.getChildrens().add(child_menu1);
        parent_menu.getChildrens().add(child_menu2);
        parent_menu.getChildrens().add(child_menu3);

        menuRepository.save(child_menu1);
        menuRepository.save(child_menu2);
        menuRepository.save(child_menu3);
        menuRepository.save(parent_menu);
    }

    @Test
    public void assertChildMenusAddToRole() {

        Menu child1 =  menuRepository.findByName(DEFAULT_NAME1).get();
        Menu child2 =  menuRepository.findByName(DEFAULT_NAME2).get();
        Menu child3 =  menuRepository.findByName(DEFAULT_NAME3).get();

        assertThat(child1).isNotNull();
        assertThat(child2).isNotNull();
        assertThat(child3).isNotNull();

        menuService.addMenuToRole("ROLE_ADMIN",child1.getId());
        menuService.addMenuToRole("ROLE_ADMIN",child2.getId());
        menuService.addMenuToRole("ROLE_ADMIN",child3.getId());

        Set<Menu> hasMenus =  authorityRepository.findOne("ROLE_ADMIN").getMenus();

        assertThat(hasMenus.contains(child1)).isTrue();
        assertThat(hasMenus.contains(child2)).isTrue();
        assertThat(hasMenus.contains(child3)).isTrue();


    }

    @Test
    public void assertParentMenusAddToRole() {
        Set<Menu> hasMenus =  authorityRepository.findOne("ROLE_ADMIN").getMenus();

        Menu child1 =  menuRepository.findByName(DEFAULT_NAME1).get();

        assertThat(hasMenus.contains(child1)).isFalse();
        assertThat(hasMenus.contains(child_menu1)).isFalse();

    }


}
