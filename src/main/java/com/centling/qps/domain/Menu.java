package com.centling.qps.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Menu.
 */
@Entity
@Table(name = "menu")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Menu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "menus")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Authority> authoritys = new HashSet<>();

    @ManyToOne
    private Menu parent;

    @OneToMany(mappedBy = "parent")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Menu> childrens = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Authority> getAuthoritys() {
        return authoritys;
    }

    public void setAuthoritys(Set<Authority> authoritys) {
        this.authoritys = authoritys;
    }

    public Menu getParent() {
        return parent;
    }

    public void setParent(Menu menu) {
        this.parent = menu;
    }

    public Set<Menu> getChildrens() {
        return childrens;
    }

    public void setChildrens(Set<Menu> menus) {
        this.childrens = menus;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Menu menu = (Menu) o;
        if(menu.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, menu.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Menu{" +
            "id=" + id +
            ", name='" + name + "'" +
            '}';
    }
}
