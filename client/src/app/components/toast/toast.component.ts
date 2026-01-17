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

        padding: 12px 20px;
        border-radius: 50px;
        z-index: 9999;

        font-family: 'NunitoSans', sans-serif; /* Use global font */
        font-size: 14px;
        font-weight: 600;

        animation: slideUp 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);

        /* --- USE GLOBAL VARIABLES --- */
        /* These automatically switch based on your styles.scss */
        background: var(--color-panels-bg);
        color: var(--color-text);
        border: 1px solid var(--color-border-subtle);
        box-shadow: var(--shadow-elev-1);
      }

      .icon-circle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        font-size: 14px;
        font-weight: 800;
      }

      /* --- SEMANTIC COLORS (Success/Error) --- */
      /* Since global vars don't have success/error, we keep these manual */
      /* They look good on both Light (#f8f8f8) and Dark (#1b1b1b) backgrounds */

      .toast.success .icon-circle {
        background: #81c995; /* Soft Green */
        color: #0d3d20; /* Dark Green Text */
      }

      .toast.error .icon-circle {
        background: #f28b82; /* Soft Red */
        color: #4a0d09; /* Dark Red Text */
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
