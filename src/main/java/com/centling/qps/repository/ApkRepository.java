package com.centling.qps.repository;

import com.centling.qps.domain.Apk;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Apk entity.
 */
public interface ApkRepository extends JpaRepository<Apk,Long> {

}
