export class CollectionUtils {
  static collectionContains<V>(collection: Iterable<V>, valueToCheck: V): boolean {
    for (let item of collection) {
      if (item === valueToCheck) {
        return true;
      }
    }
  }

  static objCollectionContains<K, V>(collection: Iterable<any>, key: K, valueToCheck: V): boolean {
    for (let item of collection) {
      if (item[key] === valueToCheck) {
        return true;
      }
    }
  }
}
