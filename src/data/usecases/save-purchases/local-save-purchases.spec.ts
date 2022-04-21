import { CacheStore } from "../../protocols/cache";
import { LocalSavePurchases } from "./local-save-purchases";

class CacheStoreSpy implements CacheStore {
    deleteCallsCount = 0;
    insertCallsCount = 0;
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

    test("Should delete old cache on sut.save", async () => {
        const { cacheStore, sut } = makeSut();
        await sut.save();
        expect(cacheStore.deleteCallsCount).toBe(1);
        expect(cacheStore.key).toBe("purchases");
    });

    test("Shouldn't insert new cache if delete fails", async () => {
        const { cacheStore, sut } = makeSut();
        jest.spyOn(cacheStore, "delete").mockImplementationOnce(() => {
            throw new Error();
        });
        const promise = sut.save();
        expect(cacheStore.insertCallsCount).toBe(0);
        expect(promise).rejects.toThrow();
    });
});
