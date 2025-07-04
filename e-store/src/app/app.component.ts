import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BnNgIdleModule, BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'estore';
  constructor(private bnIdle: BnNgIdleService,private router: Router)
  {}
  ngOnInit(): void {
    this.bnIdle.startWatching(10).subscribe((isTimedOut: boolean) => {
    if (isTimedOut) {
    console.log('session expired');
    localStorage.clear();
    //localStorage.removeItem('token');
    //localStorage.removeItem('userName');
    this.router.navigate(['/home/login']);
    this.bnIdle.stopTimer();
    }
    });
}
}
