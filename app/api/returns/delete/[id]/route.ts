// /api/returns/delete /[id]/route.ts
import {getReturnCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(id)
    const returnCollection = await getReturnCollection();

    if (!id) {
      return NextResponse.json(
        { message: "ID is required", success: false },
        { status: 400 }
      );
    }
      const  find = await returnCollection.findOne({_id: new ObjectId(id) });
      console.log(find)
      if(!find){
        return NextResponse.json(       
    { message: "Return not found", success: false },    
            
{ status: 404 }
        );
      }

    // MongoDB এর ObjectId তে রূপান্তর
    const result = await returnCollection.deleteOne({_id: new ObjectId(id) });
    console.log(result)

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Return not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Return deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /returns/delete/[id]:", error);
    return NextResponse.json(
      {
        message: "An error occurred while deleting the return",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}