import { SavePurchases } from "@/domain/usecases/save-purchases";
import { CacheStore } from "@/data/protocols/cache";
import { LocalSavePurchases } from "@/data/usecases/save-purchases/local-save-purchases";

class CacheStoreSpy implements CacheStore {
    deleteCallsCount = 0;
    insertCallsCount = 0;
    deleteKey: string;
    insertKey: string;
    insertValues: Array<SavePurchases.Params> = []

    delete(key: string): void {
        this.deleteCallsCount++;
        this.deleteKey = key;
    }

    insert(key: string, value: any): void {
        this.insertCallsCount++;
        this.insertKey = key;
        this.insertValues = value;
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

const mockPurchases = (): Array<SavePurchases.Params> => [
    {
        id: "1",
        date: new Date(),
        value: 31
    },
    {
        id: "2",
        date: new Date(),
        value: 25
    },
];

// sut => nomenclatura para o construtor da classe que está sendo testada (manguinhos)
describe("LocalSavePurchases", () => {
    test("Should not delete cache on sut.init", () => {
        const { cacheStore } = makeSut();
        expect(cacheStore.deleteCallsCount).toBe(0);
    });

    test("Should delete old cache on sut.save", async () => {
        const { cacheStore, sut } = makeSut();
        await sut.save(mockPurchases());
        expect(cacheStore.deleteCallsCount).toBe(1);
        expect(cacheStore.deleteKey).toBe("purchases");
    });

    test("Shouldn't insert new cache if delete fails", () => {
        const { cacheStore, sut } = makeSut();
        jest.spyOn(cacheStore, "delete").mockImplementationOnce(() => {
            throw new Error();
        });
        const promise = sut.save(mockPurchases());
        expect(cacheStore.insertCallsCount).toBe(0);
        expect(promise).rejects.toThrow();
    });

    test("Should insert new cache if delete succeeds", async () => {
        const { cacheStore, sut } = makeSut();
        const purchases = mockPurchases();
        await sut.save(purchases);

        expect(cacheStore.deleteCallsCount).toBe(1);
        expect(cacheStore.insertCallsCount).toBe(1);
        expect(cacheStore.insertKey).toBe("purchases");
        expect(cacheStore.insertValues).toEqual(purchases)
    });
});
