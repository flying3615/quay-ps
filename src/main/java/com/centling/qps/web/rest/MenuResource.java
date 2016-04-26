package com.centling.qps.web.rest;

import com.centling.qps.service.MenuService;
import com.codahale.metrics.annotation.Timed;
import com.centling.qps.domain.Menu;
import com.centling.qps.repository.MenuRepository;
import com.centling.qps.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

/**
 * REST controller for managing Menu.
 */
@RestController
@RequestMapping("/api")
public class MenuResource {

    private final Logger log = LoggerFactory.getLogger(MenuResource.class);

    @Inject
    private MenuRepository menuRepository;

    @Inject
    private MenuService menuService;

    /**
     * POST  /menus : Create a new menu.
     *
     * @param menu the menu to create
     * @return the ResponseEntity with status 201 (Created) and with body the new menu, or with status 400 (Bad Request) if the menu has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/menus",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Menu> createMenu(@RequestBody Menu menu) throws URISyntaxException {
        log.debug("REST request to save Menu : {}", menu);
        if (menu.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("menu", "idexists", "A new menu cannot already have an ID")).body(null);
        }
        Menu result = menuRepository.save(menu);
        return ResponseEntity.created(new URI("/api/menus/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("menu", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /menus : Updates an existing menu.
     *
     * @param menu the menu to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated menu,
     * or with status 400 (Bad Request) if the menu is not valid,
     * or with status 500 (Internal Server Error) if the menu couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/menus",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Menu> updateMenu(@RequestBody Menu menu) throws URISyntaxException {
        log.debug("REST request to update Menu : {}", menu);
        if (menu.getId() == null) {
            return createMenu(menu);
        }
        Menu result = menuRepository.save(menu);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("menu", menu.getId().toString()))
            .body(result);
    }


    @RequestMapping(value = "/menusByRole",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public TreeSet<Menu> getMenusByRoles(@RequestBody List<String> roles) throws URISyntaxException {
        log.debug("REST request to get Menus by roles : {}", roles);
        TreeSet<Menu> result = menuService.getMenusByRoleList(roles);
        return result;
    }

    @RequestMapping(value = "/addMenuToRole/{role_name}/{menuId}",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> addMenuToRole(@PathVariable String role_name, @PathVariable String menuId) throws URISyntaxException {
        log.debug("REST request to add Menus to role : {} to {}", menuId, role_name);
        menuService.addMenuToRole(role_name, menuId);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("menu", menuId.toString())).build();
    }


    @RequestMapping(value = "/delMenuToRole/{role_name}/{menuId}",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteMenuFromRole(@PathVariable String role_name, @PathVariable String menuId) throws URISyntaxException {
        log.debug("REST request to add Menus to role : {} to {}", menuId, role_name);
        menuService.deleteMenuFromRole(role_name, menuId);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("menu", menuId.toString())).build();
    }


    /**
     * GET  /menus : get all the menus.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of menus in body
     */
    @RequestMapping(value = "/menus",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Menu> getAllMenus() {
        log.debug("REST request to get all Menus");
        List<Menu> menus = menuRepository.findAll();
        return menus;
    }


    /**
     * GET  /menus : get all the menus for tree format.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of menus in body
     */
    @RequestMapping(value = "/menusTree",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Map<String, String>> getMenusTree(@RequestBody List<String> roles) {
//        rebuild
//        var nodes = [
//        {id:1, pId:0, name: "父节点1"},
//        {id:11, pId:1, name: "子节点1"},
//        {id:12, pId:1, name: "子节点2"}
//        ];
        log.debug("REST request to get List Menus tree");
        List<Map<String, String>> result = null;
        if(roles.size()==0){
            List<Menu> menus = menuRepository.findAll();
            result = menuService.formatMenus2Tree(menus);
        }else{
            TreeSet<Menu> menus = menuService.getMenusByRoleList(roles);
            result = menuService.formatMenus2Tree(menus);
        }
        return result;

    }

    /**
     * GET  /menus/:id : get the "id" menu.
     *
     * @param id the id of the menu to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the menu, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/menus/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Menu> getMenu(@PathVariable String id) {
        log.debug("REST request to get Menu : {}", id);
        Menu menu = menuRepository.findOne(id);
        return Optional.ofNullable(menu)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /menus/:id : delete the "id" menu.
     *
     * @param id the id of the menu to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/menus/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteMenu(@PathVariable String id) {
        log.debug("REST request to delete Menu : {}", id);
        menuRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("menu", id.toString())).build();
    }

}
