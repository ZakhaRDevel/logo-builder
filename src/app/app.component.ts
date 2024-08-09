import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LogoBuilderComponent} from "./core/components/logo-builder/logo-builder.component";
import {ContainerComponent} from "./core/components/container/container.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LogoBuilderComponent, ContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'logo-builder';
}
