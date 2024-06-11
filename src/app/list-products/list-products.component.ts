import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Product } from '../models/product'; // Adjust the import path
import { ProductosService } from '../services/productos.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css'],
})
export class ListProductsComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'category',
    'price',
    'amount',
    'status',
    'actions',
  ];
  dataSource: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productosService: ProductosService,
    public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.productosService.getProducts().subscribe((products: Product[]) => {
      this.dataSource.data = products;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProduct(product: Product) {
    // Implement edit functionality
  }

  deleteProduct(product: Product) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(`Deleting product with ID: ${product.id}`);

        this.productosService.deleteProduct(product.id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(
            (p) => p.id !== product.id
          );
        });
      }
    });
  }
}
