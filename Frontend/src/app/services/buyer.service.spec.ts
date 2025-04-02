import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BuyerService } from './buyer.service';

describe('BuyerService', () => {
  let service: BuyerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import the HttpClientTestingModule
      providers: [BuyerService]
    });
    service = TestBed.inject(BuyerService);
    httpMock = TestBed.inject(HttpTestingController); // Get the HttpTestingController instance
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch buyers from API', () => {
    const mockBuyers = [
      { id: 1, company_name: 'ABC Corp', concernedperson: 'John Doe', address: '123 Main St, City', contact: '1234567890', email: 'john.doe@abccorp.com', gstno: 'GST123456' },
      { id: 2, company_name: 'XYZ Ltd', concernedperson: 'Jane Smith', address: '456 Elm St, City', contact: '0987654321', email: 'jane.smith@xyz.com', gstno: 'GST654321' }
    ];

    // Call the service method to fetch buyers
    service.getBuyers().subscribe((buyers) => {
      expect(buyers.length).toBe(2); // Check if the mock response length matches
      expect(buyers).toEqual(mockBuyers); // Compare the response with the mock data
    });

    // Set up the mock API response
    const req = httpMock.expectOne('http://localhost:3000/api/buyers');
    expect(req.request.method).toBe('GET'); // Assert that it is a GET request
    req.flush(mockBuyers); // Return the mock data
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding HTTP requests after each test
  });
});
