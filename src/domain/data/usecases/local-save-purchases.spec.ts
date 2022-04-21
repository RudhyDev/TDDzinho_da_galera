class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}
}

interface CacheStore {
  
}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
}


// sut => nomenclatura para o construtor da classe que está sendo testada (manguinhos)
describe('LocalSavePurchases', () => {
  test('Should not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy();
    new LocalSavePurchases(cacheStore);
    expect(cacheStore.deleteCallsCount).toBe(0)
  })
})