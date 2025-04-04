// transactions/transaction-form/transaction-form.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../app/shared/confirm-dialog/confirm-dialog.component';
import { DatePipe ,CommonModule} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgIf,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  product: any;
  transactionType: 'BUY' | 'SELL' = 'BUY';
  currentDate = new Date().toISOString().split('T')[0];
  username: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.transactionForm = this.fb.group({
      orderid: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      date: [this.currentDate, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.product = history.state.product;
    this.username = this.authService.getCurrentUser()?.username || '';
    
    if (!this.product) {
      this.router.navigate(['/dashboard/transaction']);
    }
  }

  setTransactionType(type: 'BUY' | 'SELL'): void {
    this.transactionType = type;
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Transaction',
        message: `Are you sure you want to ${this.transactionType} this product?`,
        confirmText: 'Confirm',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.processTransaction();
      }
    });
  }

  private processTransaction(): void {
    const formValue = this.transactionForm.value;
    const transactionData = {
      product_id: this.product.id,
      productname: this.product.productname,
      category: this.product.category,
      producttype: this.product.producttype,
      modelno: this.product.modelno,
      price: this.product.price,
      orderid: formValue.orderid,
      transaction_type: this.transactionType,
      transdate: this.datePipe.transform(formValue.date, 'yyyy-MM-dd'),
      username: this.username,
      ...(this.transactionType === 'BUY' ? {
        instockdate: this.datePipe.transform(formValue.date, 'yyyy-MM-dd'),
        instockqty: formValue.quantity
      } : {
        dispatchdate: this.datePipe.transform(formValue.date, 'yyyy-MM-dd'),
        dispatchqty: formValue.quantity
      })
    };

    this.transactionService.createTransaction(transactionData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Transaction failed', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/transaction']);
  }
}