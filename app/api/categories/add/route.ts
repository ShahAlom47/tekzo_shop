import { getCategoryCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { ObjectId } from "mongodb";
import { Category } from "@/Interfaces/categoryInterfaces";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, icon, parentCategoryId } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { message: "Category name is required", success: false },
        { status: 400 }
      );
    }

    const collection = await getCategoryCollection();

    const slug = slugify(name, { lower: true, strict: true });

    // Duplicate check
    const existing = await collection.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { message: "Category already exists", success: false },
        { status: 400 }
      );
    }

    const newCategory = {
      name,
      slug,
      icon: icon || null,
      parentCategoryId: parentCategoryId
        ? new ObjectId(parentCategoryId)
        : null,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Category;

    const result = await collection.insertOne(newCategory);

    return NextResponse.json(
      {
        message: "Category added successfully",
        success: true,
        data: { ...newCategory, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        success: false,
      },
      { status: 500 }
    );
  }
}