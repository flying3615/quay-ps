package com.centling.qps.service;

import com.centling.qps.domain.Authority;
import com.centling.qps.domain.Menu;
import com.centling.qps.repository.AuthorityRepository;
import com.centling.qps.repository.MenuRepository;
import com.centling.qps.repository.UserRepository;
import org.apache.el.stream.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

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


    public Menu addMenuToRole(String role_name, String menuId) {
        Authority authority = authorityRepository.findOne(role_name);
        Menu menu = menuRepository.findOne(menuId);
        authority.getMenus().add(menu);

        if(menu.getParent()!=null) {
            //is child
            authority.getMenus().add(menu.getParent());
        }else {
            //is parent, need to add its all children
            menuRepository.findByParentId(menuId).stream().map(child->
                authority.getMenus().add(child)
            );
        }
        authorityRepository.save(authority);
        return menu;
    }

    public void deleteMenuFromRole(String role_name,String menuId){
        Authority authority = authorityRepository.findOne(role_name);

        //delete all children menus from role
//        menuRepository.findOneByParentId(menuParentId).ifPresent(parent_menu->{

//        });


    }


}
