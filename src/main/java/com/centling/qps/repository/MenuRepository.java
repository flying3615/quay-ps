package com.centling.qps.repository;

import com.centling.qps.domain.Menu;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Menu entity.
 */
public interface MenuRepository extends JpaRepository<Menu,Long> {

}
