/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, OnInit} from '@angular/core';

/**
 * Component that handles OAuth success callback.
 * This component is displayed when the OAuth provider redirects back to /auth/success.
 * It automatically closes the popup window after a brief delay.
 */
@Component({
  selector: 'app-auth-success',
  template: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif;">
      <div style="text-align: center;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#4CAF50" stroke-width="2"/>
          <path d="M8 12L11 15L16 9" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 style="color: #4CAF50; margin-top: 16px;">Authorization Successful!</h2>
        <p style="color: #666; margin-top: 8px;">This window will close automatically...</p>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
})
export class AuthSuccessComponent implements OnInit {
  ngOnInit(): void {
    // Close the popup window after a brief delay to show the success message
    setTimeout(() => {
      window.close();
    }, 1500);
  }
}

