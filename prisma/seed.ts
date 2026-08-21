import { PrismaClient } from "@prisma/client";
import { colleges } from "../lib/data/colleges";

const prisma = new PrismaClient();

function placementRate(rating: number, acceptanceRate: number): number {
  const rate = 68 + rating * 5 - Math.min(acceptanceRate, 20) * 0.15;
  return Math.round(Math.min(98, Math.max(60, rate)) * 10) / 10;
}

async function main() {
  for (const college of colleges) {
    await prisma.college.upsert({
      where: { id: college.id },
      update: {
        slug: college.slug,
        name: college.name,
        shortName: college.shortName,
        city: college.city,
        state: college.state,
        type: college.type,
        established: college.established,
        rating: college.rating,
        totalReviews: college.totalReviews,
        annualFees: college.annualFees,
        acceptanceRate: college.acceptanceRate,
        studentCount: college.studentCount,
        facultyRatio: college.facultyRatio,
        campusSizeAcres: college.campusSizeAcres,
        description: college.description,
        longDescription: college.longDescription,
        tags: college.tags,
        accentIndex: college.accentIndex,
      },
      create: {
        id: college.id,
        slug: college.slug,
        name: college.name,
        shortName: college.shortName,
        city: college.city,
        state: college.state,
        type: college.type,
        established: college.established,
        rating: college.rating,
        totalReviews: college.totalReviews,
        annualFees: college.annualFees,
        acceptanceRate: college.acceptanceRate,
        studentCount: college.studentCount,
        facultyRatio: college.facultyRatio,
        campusSizeAcres: college.campusSizeAcres,
        description: college.description,
        longDescription: college.longDescription,
        tags: college.tags,
        accentIndex: college.accentIndex,
      },
    });

    for (const course of college.courses) {
      await prisma.course.upsert({
        where: { id: `${college.id}-${course.id}` },
        update: {
          collegeId: college.id,
          name: course.name,
          degree: course.degree,
          durationYears: course.durationYears,
          annualFees: course.annualFees,
          seats: course.seats,
        },
        create: {
          id: `${college.id}-${course.id}`,
          collegeId: college.id,
          name: course.name,
          degree: course.degree,
          durationYears: course.durationYears,
          annualFees: course.annualFees,
          seats: course.seats,
        },
      });
    }

    await prisma.placement.upsert({
      where: { collegeId: college.id },
      update: {
        averagePackage: college.averagePackage,
        highestPackage: college.highestPackage,
        medianPackage: Math.round(college.averagePackage * 0.86 * 10) / 10,
        placementRate: placementRate(college.rating, college.acceptanceRate),
      },
      create: {
        id: `placement-${college.id}`,
        collegeId: college.id,
        averagePackage: college.averagePackage,
        highestPackage: college.highestPackage,
        medianPackage: Math.round(college.averagePackage * 0.86 * 10) / 10,
        placementRate: placementRate(college.rating, college.acceptanceRate),
      },
    });

    for (const review of college.reviews) {
      await prisma.review.upsert({
        where: { id: `${college.id}-${review.id}` },
        update: {
          collegeId: college.id,
          author: review.author,
          course: review.course,
          rating: review.rating,
          date: new Date(`${review.date}T00:00:00.000Z`),
          title: review.title,
          body: review.body,
        },
        create: {
          id: `${college.id}-${review.id}`,
          collegeId: college.id,
          author: review.author,
          course: review.course,
          rating: review.rating,
          date: new Date(`${review.date}T00:00:00.000Z`),
          title: review.title,
          body: review.body,
        },
      });
    }
  }

  console.log(`Seeded ${colleges.length} colleges.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
