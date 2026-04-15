import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { USER_SESSION_KEY } from '../connexion/connexion';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClientService } from '../../services/client.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

export type Client = {
  id: string;
  lastname: string;
  firstname: string;
  phoneNumber: string;
};

@Component({
  templateUrl: 'clients.html',
  styleUrl: 'clients.css',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,

    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly clientsService = inject(ClientService);
  user = signal<any>(null);
  displayedColumns: string[] = ['lastname', 'firstname', 'phoneNumber', 'action'];
  dataSource = signal<Client[]>([]);
  form!: FormGroup;
  showAddForm = signal(false);
  showEditForm = signal(false);

  loading = signal(true);

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });

    const isUserConnected = localStorage.getItem(USER_SESSION_KEY);
    this.user.set(isUserConnected ? JSON.parse(isUserConnected) : null);

    this.clientsService.getClients().subscribe((res) => {
      if (res) {
        const data = Object.entries(res).map(([key, value]: any) => ({
          id: key,
          lastname: value.lastname,
          firstname: value.firstname,
          phoneNumber: value.phoneNumber,
        }));
        this.dataSource.set(data);
      } else {
        this.dataSource.set([]);
      }
      this.loading.set(false);
    });
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.showEditForm()) {
        this.clientsService.updateClient(this.form.value.id, this.form.value);
      } else {
        this.clientsService.addClient(this.form.value);
      }
      this.handleFormDisplay(false);
    }
  }

  handleFormDisplay(isVisisble: boolean) {
    if (isVisisble) {
      this.showAddForm.set(true);
    } else {
      this.showAddForm.set(false);
      this.showEditForm.set(false);

      this.form.reset();
    }
  }

  editClient(client: Client) {
    this.showEditForm.set(true);
    this.form.setValue(client);
    this.handleFormDisplay(true);
  }

  deleteClient(client: Client) {
    this.clientsService.deleteClient(client.id);
  }
}
