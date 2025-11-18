import { Injectable, signal, computed } from '@angular/core';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  readonly properties = signal<any[]>([]);
  readonly selectedPropertyId = signal<string | null>(null);

  readonly selectedProperty = computed(() => {
    const id = this.selectedPropertyId();
    if (!id) {
      return null;
    }
    return this.properties().find(p => p.id === id);
  });

  constructor() {
    // Initialize with some dummy data if needed for testing
    // this.addProperty({
    //   general: { propertyCode: 'DEMO1', propertyName: 'Demo Hotel One' },
    //   location: { addressLine: '123 Test St', postalCode: '12345', city: 'Testville', country: 'Germany', timezone: 'Europe/Berlin', currencyCode: 'EUR', checkInTime: '15:00', checkOutTime: '11:00' },
    //   company: { companyName: 'Demo Company GmbH' }
    // });
  }

  addProperty(propertyData: any): void {
    const newProperty = { ...propertyData, id: uuidv4() };
    this.properties.update(currentProperties => [...currentProperties, newProperty]);
  }

  updateProperty(id: string, updatedData: any): void {
    this.properties.update(currentProperties =>
      currentProperties.map(p => (p.id === id ? { ...p, ...updatedData } : p))
    );
  }

  setSelectedPropertyById(id: string | null): void {
    this.selectedPropertyId.set(id);
  }
}
