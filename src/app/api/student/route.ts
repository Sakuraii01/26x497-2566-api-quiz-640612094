import { getPrisma } from "@/libs/getPrisma";
import { Student } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export type StudentGetResponse = {
  students: Student[];
};

export const GET = async () => {
  //2. Display list of student
  // const students = await prisma...
  const prisma = getPrisma();
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        studentId: "asc",
      },
    });

    return NextResponse.json<StudentGetResponse>({
      students: students,
    });
  } catch (error) {
    return NextResponse.error();
  }
};

export type StudentPostOKResponse = { ok: true };
export type StudentPostErrorResponse = { ok: false; message: string };
export type StudentPostResponse =
  | StudentPostOKResponse
  | StudentPostErrorResponse;

export type StudentPostBody = Pick<
  Student,
  "studentId" | "firstName" | "lastName"
>;

export const POST = async (request: NextRequest) => {
  const body = (await request.json()) as StudentPostBody;
  const prisma = getPrisma();
  //4. Add new Student data
  try {
    // await prisma...

    // Check if a student with the same studentId already exists
    const existingStudent = await prisma.student.findFirst({
      where: {
        studentId: body.studentId,
      },
    });
    // return NextResponse.json<StudentPostErrorResponse>(
    //   { ok: false, message: "Student Id already exists" },
    //   { status: 400 }
    // );
    if (existingStudent) {
      return NextResponse.json<StudentPostErrorResponse>(
        { ok: false, message: "Student Id already exists" },
        { status: 400 }
      );
    }
    const newStudent = await prisma.student.create({
      data: {
        studentId: body.studentId,
        firstName: body.firstName,
        lastName: body.lastName,
      },
    });
    return NextResponse.json<StudentPostOKResponse>({ ok: true });
  } catch (error) {
    return NextResponse.error();
  }
  // return NextResponse.json<StudentPostOKResponse>({ ok: true });
};
