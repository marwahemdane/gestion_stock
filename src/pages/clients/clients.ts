import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { USER_SESSION_KEY } from '../connexion/connexion';
import { ClientService } from '../../services/client.service';

export type Client = {
  id: string;
  lastname: string;
  firstname: string;
  phoneNumber: string;
};

@Component({
  selector: 'app-clients',
  templateUrl: 'clients.html',
  styleUrl: 'clients.css',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
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
    this.initForm();
    this.loadUser();
    this.loadClients();
  }

  private initForm() {
    this.form = this.fb.group({
      id: [null],
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8,}$')]],
    });
  }

  private loadUser() {
    const isUserConnected = localStorage.getItem(USER_SESSION_KEY);
    this.user.set(isUserConnected ? JSON.parse(isUserConnected) : null);
  }

  private loadClients() {
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

  handleFormDisplay(isVisible: boolean) {
    this.showAddForm.set(isVisible);
    if (!isVisible) {
      this.showEditForm.set(false);
      this.form.reset();
    }
  }

  editClient(client: Client) {
    this.showEditForm.set(true);
    this.form.patchValue(client);
    this.showAddForm.set(true);
  }

  deleteClient(client: Client) {
    if (confirm(`Supprimer le client ${client.firstname} ${client.lastname} ?`)) {
      this.clientsService.deleteClient(client.id);
    }
  }
}
