import { Component } from '@angular/core';
import { Product, CreateProductDTO, UpdateProductDTO } from '../../models/product.model';
import { StoreService } from '../../services/store.service';
import { ProductsService} from '../../services/products.service'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  today = new Date();
  date = new Date(2021, 1, 21);
  showProductDetail = false;
  prodductChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    description: '',
    category: {
      id: '',
      name: ''
    }
  };

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
    ) {
    this.myShoppingCart = this.storeService.getShoppingCart();

  }

  ngOnInit(): void {
    this.productsService.getAllProducts()
    .subscribe(data => {
      this.products = data;
    });

  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.productsService.getProduct(id)
    .subscribe(data => {
      this.toggleProductDetail();
      this.prodductChosen = data;
    })
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: "Nuevo producto",
      price: 1000,
      categoryId: 1,
      description: 'Tal de tal',
      images: ['']
    }
    this.productsService.create(product)
    .subscribe(data => {
      this.products.unshift(data);
    });
  }

  updateProduct() {
    const changes: UpdateProductDTO = {
      title: "Que chimba Medallooooo"
    }
    const id = this.prodductChosen.id;
    this.productsService.update(id, changes)
    .subscribe(data => {
      const productIndex = this.products.findIndex(item => item.id === this.prodductChosen.id);
      this.products[productIndex] = data;
    })
  }

  deleteProduct() {
    const id = this.prodductChosen.id;
    this.productsService.delete(id)
    .subscribe(() => {
      const productIndex = this.products.findIndex(item => item.id === this.prodductChosen.id);
      this.products.splice(productIndex, 1);
      this.showProductDetail = false;
    })
  }
}
