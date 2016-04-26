package com.centling.qps.service;

import com.centling.qps.domain.Authority;
import com.centling.qps.domain.Menu;
import com.centling.qps.repository.AuthorityRepository;
import com.centling.qps.repository.MenuRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by centling on 2016/4/19.
 */
@Service
@Transactional
public class MenuService {

    private final Logger log = LoggerFactory.getLogger(MenuService.class);

    @Inject
    private MenuRepository menuRepository;

    @Inject
    private AuthorityRepository authorityRepository;


    public Authority addMenuToRole(String role_name, String menuId) {
        //TODO change to optional
        Authority authority = authorityRepository.findOne(role_name);
        Menu menu = menuRepository.findOne(menuId);
        authority.getMenus().add(menu);

        if(menu.isChild()) {
            //is child, add its parent
            authority.getMenus().add(menu.getParent());
        }else {
            //is parent, need to find and add its all children
            menuRepository.findByParentId(menuId).stream().
                forEach(child-> authority.getMenus().add(child));
        }
        authorityRepository.save(authority);
        return authority;
    }

    public Authority deleteMenuFromRole(String role_name,String menuId){

        Authority authority = authorityRepository.findOne(role_name);
        Menu menu = menuRepository.findOne(menuId);
        authority.getMenus().remove(menu);

        if(menu.isChild()) {
            Menu parent = menuRepository.findOne(menu.getParent().getId());
            //is the last child, remove its parent as well
            //if there is no child else has the same parent id, then remove its parent
            authority.getMenus().stream()
                .filter(menu_org_child->menu_org_child.isChild())
                    .filter(menu_org->menu_org.getParent().getId()==menu.getParent().getId())
                        .findAny()
                            .orElseGet(()->{authority.getMenus().remove(parent); return null;});
        }else {
            //is parent, need to find and remove its all children
            menuRepository.findByParentId(menuId).stream()
                .forEach(child->authority.getMenus().remove(child));
        }
        authorityRepository.save(authority);
        return authority;

    }

    public TreeSet<Menu> getMenusByRoleList(List<String> role_names){
        Set<Menu> menusInOrder = role_names.stream()
            .map(role_name->{Authority authority = authorityRepository.findOne(role_name);return authority.getMenus();})
            .reduce(new TreeSet<>(),(all,items)->{all.addAll(items);return all;});

        return new TreeSet<>(menusInOrder);
    }

    public List<Map<String, String>> formatMenus2Tree(Collection<Menu> menus){
        List<Map<String, String>> result = menus.stream().map(menu -> {
            Map<String, String> menuTmp = new HashMap<>();
            menuTmp.put("id", menu.getId());
            menuTmp.put("name", menu.getName());
            menuTmp.put("order", menu.getOrder_no().toString());
            String garbage = menu.isChild() ? menuTmp.put("pId", menu.getParent().getId()) : menuTmp.put("pId", "0");
            return menuTmp;
        }).collect(Collectors.toList());
        result.sort((Map<String, String> menu1, Map<String, String> menu2) ->
            Integer.parseInt(menu1.get("order"))-Integer.parseInt(menu2.get("order")));
        return result;
    }

}
