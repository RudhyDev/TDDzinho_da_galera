import { SavePurchases } from '@/domain';
import { CacheStore } from '../../protocols/cache'

export class LocalSavePurchases implements SavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}

  async save(purcheses: Array<SavePurchases.Params>): Promise<void> {
      this.cacheStore.delete("purchases");
      this.cacheStore.insert("purchases", purcheses);
  }
}
