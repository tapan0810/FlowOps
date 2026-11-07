import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  imports: [
    Sidebar,
    Topbar,
    RouterOutlet
  ],
  selector: 'app-app-shell',
  styleUrl: './app-shell.scss',
  templateUrl: './app-shell.html',
})
export class AppShell {}
