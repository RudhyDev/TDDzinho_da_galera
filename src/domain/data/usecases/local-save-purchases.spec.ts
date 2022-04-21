class LocalSavePurchases {
    constructor(private readonly cacheStore: CacheStore) {}

    async save(): Promise<void> {
        this.cacheStore.delete();
    }
}

interface CacheStore {
    delete: () => void;
}

class CacheStoreSpy implements CacheStore {
    deleteCallsCount = 0;

    delete(): void{
      this.deleteCallsCount++
    }
}

// sut => nomenclatura para o construtor da classe que está sendo testada (manguinhos)
describe("LocalSavePurchases", () => {
    test("Should not delete cache on sut.init", () => {
        const cacheStore = new CacheStoreSpy();
        new LocalSavePurchases(cacheStore);
        expect(cacheStore.deleteCallsCount).toBe(0);
    });

    test("Should delete old cache on sut.delete", async () => {
        const cacheStore = new CacheStoreSpy();
        const sut = new LocalSavePurchases(cacheStore);
        await sut.save();
        expect(cacheStore.deleteCallsCount).toBe(1);
    });
});
