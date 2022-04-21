class LocalSavePurchases {
    constructor(private readonly cacheStore: CacheStore) {}

    async save(): Promise<void> {
        this.cacheStore.delete('purchases');
    }
}

interface CacheStore {
    delete: (key: string) => void;
}

class CacheStoreSpy implements CacheStore {
    deleteCallsCount = 0;
    key: string;

    delete(key: string): void {
        this.deleteCallsCount++;
        this.key = key;
    }
}

type SutTypes = {
    sut: LocalSavePurchases;
    cacheStore: CacheStoreSpy;
};

// Isso é uma Factory para instanciar as classes necessárias para testar o SUT
const makeSut = (): SutTypes => {
    const cacheStore = new CacheStoreSpy();
    const sut = new LocalSavePurchases(cacheStore);

    return {
        cacheStore,
        sut,
    };
};

// sut => nomenclatura para o construtor da classe que está sendo testada (manguinhos)
describe("LocalSavePurchases", () => {
    test("Should not delete cache on sut.init", () => {
        const { cacheStore } = makeSut();
        expect(cacheStore.deleteCallsCount).toBe(0);
    });

    test("Should delete old cache on sut.delete", async () => {
        const { cacheStore, sut } = makeSut();
        await sut.save();
        expect(cacheStore.deleteCallsCount).toBe(1);
    });

    test("Should call delete with corret key", async () => {
      const { cacheStore, sut } = makeSut();
      await sut.save();
      expect(cacheStore.key).toBe('purchases');
  });

});
