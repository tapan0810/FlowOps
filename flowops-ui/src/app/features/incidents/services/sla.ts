
import { Injectable, computed, inject } from '@angular/core';
import { interval, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import type { Incident } from '../models/incident.model';

export type SlaHealth = 'On Track' | 'At Risk' | 'Breached';

export interface SlaMetrics {
  targetMinutes: number;
  elapsedMinutes: number;
  remainingMinutes: number;
  progressPercentage: number;
  health: SlaHealth;
  isBreached: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SlaService {

  // A shared clock that updates every second.
  private readonly clock = toSignal(
    interval(1000).pipe(map(() => Date.now())),
    { initialValue: Date.now() }
  );

  // Calculate SLA metrics for one incident.
  calculateMetrics(incident: Incident): SlaMetrics {

    // Read the clock Signal so the calculation can react to time.
    const now = this.clock();

    const createdAt = new Date(incident.createdAt).getTime();
    const targetMinutes = incident.slaTargetMinutes;

    if (
      !Number.isFinite(createdAt) ||
      !Number.isFinite(targetMinutes) ||
      targetMinutes <= 0
    ) {
      return {
        targetMinutes: 0,
        elapsedMinutes: 0,
        remainingMinutes: 0,
        progressPercentage: 0,
        health: 'On Track',
        isBreached: false
      };
    }

    const elapsedMilliseconds = Math.max(0, now - createdAt);

    const elapsedMinutes = Math.floor(
      elapsedMilliseconds / 60000
    );

    const remainingMinutes = Math.max(
      0,
      targetMinutes - elapsedMinutes
    );

    const progressPercentage = Math.min(
      100,
      (elapsedMilliseconds / (targetMinutes * 60000)) * 100
    );

    const isBreached = elapsedMilliseconds >= targetMinutes * 60000;

    let health: SlaHealth;

    if (isBreached) {
      health = 'Breached';
    } else if (progressPercentage >= 75) {
      health = 'At Risk';
    } else {
      health = 'On Track';
    }

    return {
      targetMinutes,
      elapsedMinutes,
      remainingMinutes,
      progressPercentage: Math.round(progressPercentage),
      health,
      isBreached
    };
  }
}
