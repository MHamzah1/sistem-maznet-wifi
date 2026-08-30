export interface Item {
  createdAt: string;
  id: number;
  title: string;
}

export async function listItems(): Promise<Item[]> {
  const response = await fetch("/api/items");

  if (!response.ok) {
    throw new Error("Unable to load items.");
  }

  return response.json() as Promise<Item[]>;
}

export async function createItem(title: string): Promise<Item> {
  const response = await fetch("/api/items", {
    body: JSON.stringify({ title }),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Unable to create item.");
  }

  return response.json() as Promise<Item>;
}
