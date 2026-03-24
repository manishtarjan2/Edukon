import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    // 1️⃣ Connect DB
    await connectDB();

    // 2️⃣ Read query params
    const { searchParams } = new URL(req.url);

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const search = searchParams.get("q") || "";

    // 3️⃣ Build query - only show students (not admins or founders)
    const baseQuery = { role: 'user' };
    const query = search
      ? {
        ...baseQuery,
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { user_id: { $regex: search, $options: "i" } },
        ],
      }
      : baseQuery;

    // 4️⃣ Fetch users - return ALL if no pagination params, otherwise paginate
    let users;
    const total = await User.countDocuments(query);

    if (pageParam) {
      const page = Number(pageParam) || 1;
      const limit = Number(limitParam) || 10;
      users = await User.find(query)
        .select('-password')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        users,
        page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
      });
    } else {
      // Return ALL students (used by admin dashboard)
      users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        users,
        totalUsers: total,
      });
    }
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
