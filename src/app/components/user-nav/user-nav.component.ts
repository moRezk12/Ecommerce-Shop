import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { CartService } from '../../core/service/cart.service';
import { UserDataService } from '../../core/service/user-data.service';
import { AuthService } from './../../core/service/auth.service';
@Component({
  selector: 'app-user-nav',
  standalone: true,
  imports: [
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    CommonModule,
  ],
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UserNavComponent {
  constructor(
    private _userData: UserDataService,
    private _cart: CartService,
    private _auth: AuthService,
    private router: Router
  ) {}

  items: MenuItem[] | undefined;
  logOut: boolean = false;
  username: string = '';
  cartCount: number = 0;

  ngOnInit() {
    this.getUserName();
    this.getUserCartCount();
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        path: 'home',
      },
      {
        label: 'Products',
        icon: 'pi pi-sparkles',
        path: 'products',
      },
      {
        label: 'Categories',
        icon: 'pi pi-th-large',
        path: 'categories',
      },
    ];

    this._cart.countOfCart.subscribe((next) => {
      this.cartCount = next;
    });
  }

  getUserName(): void {
    this._userData.userName.subscribe((next) => {
      this.username = next;
      console.log(next);
    });
  }
  getUserCartCount(): void {
    const id = localStorage.getItem('token') ?? '';
    this._cart.countOfCart.subscribe((next) => (this.cartCount = next));
  }

  logout(): void {
    this._auth.logout().subscribe((next) => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.router.navigate(['login']);
    });
  }
}
