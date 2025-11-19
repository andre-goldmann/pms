import { Injectable, signal, computed } from '@angular/core';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

export interface ContextItem {
  id: string;
  name: string;
  subtext?: string;
  type: 'account' | 'property';
}

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  readonly properties = signal<any[]>([]);
  readonly selectedPropertyId = signal<string | null>(null);
  readonly selectedContextId = signal<string | null>('account'); // 'account' or a property ID

  readonly selectedProperty = computed(() => {
    const id = this.selectedPropertyId();
    if (!id) {
      return null;
    }
    return this.properties().find(p => p.id === id);
  });

  readonly contextItems = computed<ContextItem[]>(() => {
    const items: ContextItem[] = [
      { id: 'account', name: 'Account', type: 'account' }
    ];
    this.properties().forEach(p => {
      items.push({
        id: p.id,
        name: p.general.propertyName,
        subtext: p.general.propertyCode, // Use property code as subtext
        type: 'property'
      });
    });
    return items;
  });

  readonly currentContextName = computed(() => {
    const selectedId = this.selectedContextId();
    const item = this.contextItems().find(c => c.id === selectedId);
    return item ? item.name : 'Unknown Context';
  });

  readonly currentContextIsProperty = computed(() => {
    const selectedId = this.selectedContextId();
    const item = this.contextItems().find(c => c.id === selectedId);
    return item?.type === 'property';
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
    this.setSelectedContext(newProperty.id); // Select the newly created property
  }

  updateProperty(id: string, updatedData: any): void {
    this.properties.update(currentProperties =>
      currentProperties.map(p => (p.id === id ? { ...p, ...updatedData } : p))
    );
  }

  setSelectedPropertyById(id: string | null): void {
    this.selectedPropertyId.set(id);
    if (id) {
      this.selectedContextId.set(id);
    } else {
      this.selectedContextId.set('account'); // Default to account if no property selected
    }
  }

  setSelectedContext(id: string | null): void {
    this.selectedContextId.set(id);
    // If a property is selected in the context, also update selectedPropertyId
    const selectedItem = this.contextItems().find(item => item.id === id);
    if (selectedItem && selectedItem.type === 'property') {
      this.selectedPropertyId.set(id);
    } else {
      this.selectedPropertyId.set(null); // No property selected, so clear it
    }
  }
}