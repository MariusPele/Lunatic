import IndexedDBStore from '../../constants/indexedDBStore';

function get(db: IDBDatabase): Promise<number> {
	return new Promise(function (resolve, reject) {
		try {
			const transaction = db.transaction(
				[IndexedDBStore.STORE_DATA_NAME],
				'readonly'
			);

			const store = transaction.objectStore(IndexedDBStore.STORE_DATA_NAME);
			const countRequest = store.count();
			countRequest.onsuccess = function () {
				resolve(countRequest.result as number);
			};
		} catch (e) {
			reject(e);
		}
	});
}

export default get;
