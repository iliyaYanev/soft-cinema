import {Component, Input, OnInit} from '@angular/core';
import {Movie} from "../../models/movie";
import {state, trigger, style, transition, animate} from "@angular/animations";
import {IMAGE_SIZES} from "../../constants/constants";

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    animations: [
        trigger('fade', [
            state('void', style({opacity: 0})),
            transition('void <=> *', [animate('1s')])
        ])
    ]
})
export class SliderComponent implements OnInit {
    @Input() movies: Movie[] = [];

    index: number = 0;
    readonly imageSizes = IMAGE_SIZES;

    ngOnInit(): void {
        setInterval(() => {
            this.index = ++this.index % this.movies.length;
        }, 5000);
    }
}
