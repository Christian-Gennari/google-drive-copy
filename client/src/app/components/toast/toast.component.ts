import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    @if (toastService.toast(); as msg) {
      <div class="toast" [ngClass]="msg.type">
        <span class="icon">{{ msg.type === 'success' ? '✅' : '⚠️' }}</span>
        <span>{{ msg.text }}</span>
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
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        font-weight: 500;
      }
      .toast.success {
        background: #e6f4ea;
        color: #1e8e3e;
        border: 1px solid #ceead6;
      }
      .toast.error {
        background: #fce8e6;
        color: #d93025;
        border: 1px solid #fad2cf;
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
