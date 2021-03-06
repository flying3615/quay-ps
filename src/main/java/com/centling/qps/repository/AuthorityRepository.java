package com.centling.qps.repository;

import com.centling.qps.domain.Authority;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data JPA repository for the Authority entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {


    List<Authority> findByNameIn(List<String> roleNames);
}
