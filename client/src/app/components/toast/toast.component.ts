import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    @if (toastService.toast(); as msg) {
      <div class="toast" [ngClass]="msg.type">
        <div class="icon-circle">
          <span>{{ msg.type === 'success' ? '✓' : '!' }}</span>
        </div>
        <span class="message">{{ msg.text }}</span>
      </div>
    }
  `,
  styles: [
    `
      .toast {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);

        display: flex;
        align-items: center;
        gap: 12px;

        // Dark Theme Colors
        background: #1e1e1e; // Dark grey surface
        color: #e3e3e3; // Off-white text
        border: 1px solid #333;

        padding: 12px 20px;
        border-radius: 50px; // Pill shape is very modern
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        z-index: 9999;

        font-family: 'Roboto', sans-serif;
        font-size: 14px;
        font-weight: 500;

        animation: slideUp 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
      }

      // Icon Container styles
      .icon-circle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        font-size: 14px;
        font-weight: bold;
      }

      // SUCCESS VARIANT
      .toast.success {
        .icon-circle {
          background: #81c995; // Soft Green
          color: #0d3d20; // Dark Green text inside circle
        }
      }

      // ERROR VARIANT
      .toast.error {
        .icon-circle {
          background: #f28b82; // Soft Red
          color: #4a0d09; // Dark Red text inside circle
        }
      }

      @keyframes slideUp {
        from {
          transform: translate(-50%, 100%);
          opacity: 0;
        }
        to {
          transform: translate(-50%, 0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class ToastComponent {
  toastService = inject(ToastService);
}
