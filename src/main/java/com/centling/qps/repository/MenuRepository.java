package com.centling.qps.repository;

import com.centling.qps.domain.Menu;

import com.centling.qps.domain.User;
import org.springframework.data.jpa.repository.*;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the Menu entity.
 */
public interface MenuRepository extends JpaRepository<Menu,String> {

    List<Menu> findByParentId(String parentId);

    Optional<Menu> findByName(String menuName);

    Optional<Menu> findByUrl(String menu_url);
}
