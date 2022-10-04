<script lang="ts">
    import {
      Collapse,
      Navbar,
      NavbarToggler,
      NavbarBrand,
      Nav,
      NavItem,
      NavLink
    } from 'sveltestrap';
  
    let isOpen = false;
    const toggle = () => (isOpen = !isOpen);
  </script>
  
  <Navbar color="light" light>
    <NavbarBrand href="/about" class="me-auto">About</NavbarBrand>
    <NavbarBrand href="/trending" class="me-auto">Trending</NavbarBrand>
    <NavbarBrand href="/gamelist" class="me-auto">Games</NavbarBrand>
    <NavbarBrand href="/edit" class="me-auto">Create</NavbarBrand>
    <NavbarBrand href="/leaderboard" class="me-auto">Leaderboard</NavbarBrand>
    <NavbarToggler on:click={toggle} class="me-2" />
    <Collapse {isOpen} navbar>
      <Nav navbar>
        <NavItem>
          <NavLink href="/">Search</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/">Login</NavLink>
        </NavItem>
      </Nav>
    </Collapse>
  </Navbar>