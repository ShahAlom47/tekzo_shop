
import { Collection, Db } from "mongodb";
import clientPromise from "./db_connection";
import { User } from "@/interfaces/userInterface";
import { Sale } from "@/interfaces/saleInterfaces";
import { CustomerWithOutId } from "@/interfaces/customerInterface";
import { Payment } from "@/interfaces/paymentInterface";
import { Expense } from "@/interfaces/expensesInterface";
import { Purchase } from "@/interfaces/purchaseInterface";
import { FundRecord } from "@/interfaces/fundRecordInterface";
import Category from "@/interfaces/categoryInterfaces";
import { Product } from "@/interfaces/productInterface";
import { Return } from "@/interfaces/returnInterface";


export const getUserCollection = async (): Promise<Collection<User>> => {
  const client = await clientPromise;
  const db: Db = client.db("TekzoBD-Offline-Store-DB"); // Replace with your database name
  return db.collection<User>("users");
};

export const getCategoryCollection = async (): Promise<Collection<Category>> => {
  const client = await clientPromise;
  const db: Db = client.db("TekzoBD-Offline-Store-DB"); // Replace with your database name
  return db.collection<Category>("categories");
};
export const getProductCollection = async (): Promise<Collection<Product>> => {
  const client = await clientPromise;
  const db: Db = client.db("TekzoBD-Offline-Store-DB"); // Replace with your database name
  return db.collection<Product>("products");
};
export const getSalesCollection = async (): Promise<Collection<Sale>> => {
  const client = await clientPromise;
  const db: Db = client.db("TekzoBD-Offline-Store-DB"); // Replace with your database name
  return db.collection<Sale>("sales");
};
export const getCustomerCollection = async (): Promise<Collection<CustomerWithOutId>> => {
  const client = await clientPromise;
  const db: Db = client.db("TekzoBD-Offline-Store-DB"); // Replace with your database name
  return db.collection<CustomerWithOutId>("customers");
};
export const getPaymentsCollection = async (): Promise<Collection<Payment>> => {
  const client = await clientPromise;
  const db: Db = client.db("TekzoBD-Offline-Store-DB"); // Replace with your database name
  return db.collection<Payment>("payments");
};
export const getExpensesCollection = async (): Promise<Collection<Expense>> => {
  const client = await clientPromise;
  const db: Db = client.db("TekzoBD-Offline-Store-DB"); // Replace with your database name
  return db.collection<Expense>("expenses");
};
export const getPurchaseCollection = async (): Promise<Collection<Purchase>> => {
  const client = await clientPromise;
  const db: Db = client.db("TekzoBD-Offline-Store-DB"); // Replace with your database name
  return db.collection<Purchase>("purchase");
};
export const getFundCollection = async (): Promise<Collection<FundRecord>> => {
  const client = await clientPromise;
  const db: Db = client.db("TekzoBD-Offline-Store-DB"); // Replace with your database name
  return db.collection<FundRecord>("fund-record");
};
export const getReturnCollection = async (): Promise<Collection<Return>> => {
  const client = await clientPromise;
  const db: Db = client.db("TekzoBD-Offline-Store-DB"); // Replace with your database name
  return db.collection<Return>("returns");
};
