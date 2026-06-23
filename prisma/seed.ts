import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { calculateFeasibility } from "../src/lib/feasibility";
import { PLOT_POINTS, defaultPerspectiveImages, pakChongPerspectiveImages } from "../src/lib/subdivision";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

function perspectiveImages(seedPrefix: string) {
  return defaultPerspectiveImages(seedPrefix);
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.booking.deleteMany();
  await prisma.plot.deleteMany();
  await prisma.subdivisionProject.deleteMany();
  await prisma.feasibilityAnalysis.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating users...");
  const buyer = await prisma.user.create({
    data: { name: "คุณวิภา ผู้ซื้อ", email: "buyer@landos.dev", role: "BUYER" },
  });
  const landowner = await prisma.user.create({
    data: { name: "คุณสมชาย เจ้าของที่ดิน", email: "somchai@landos.dev", role: "LANDOWNER" },
  });
  const admin = await prisma.user.create({
    data: { name: "ผู้ดูแลระบบ", email: "admin@landos.dev", role: "ADMIN" },
  });

  console.log("Creating listings...");

  // 1. Whole-land-only listing — Chiang Mai
  const chiangMai = await prisma.listing.create({
    data: {
      title: "ที่ดินวิวภูเขา ใกล้ถนนวงแหวน",
      province: "เชียงใหม่",
      district: "แม่ริม",
      subdistrict: "ริมใต้",
      landArea: 8,
      lat: 18.9388,
      lng: 98.9253,
      wholeLandPrice: 24_000_000,
      description:
        "ที่ดินเปล่าวิวภูเขา เหมาะสำหรับสร้างบ้านพักตากอากาศหรือรีสอร์ทขนาดเล็ก ใกล้ถนนวงแหวนรอบนอก เดินทางสะดวก",
      saleMode: "WHOLE",
      status: "PUBLISHED",
      ownerId: landowner.id,
      images: {
        create: [
          { url: "/listings/chiangmai/photo-1.jpg", order: 0 },
          { url: "/listings/pakchong-musi/photo-2.jpg", order: 1 },
          { url: "/listings/pakchong-musi/photo-3.jpg", order: 2 },
        ],
      },
    },
  });

  // 2. Subdivision-only listing — Nonthaburi (with 8-plot project)
  const nonthaburi = await prisma.listing.create({
    data: {
      title: "โครงการแบ่งแปลงที่ดิน หมู่บ้านสวนเรือน",
      province: "นนทบุรี",
      district: "บางใหญ่",
      subdistrict: "เสาธงหิน",
      landArea: 5,
      lat: 13.8662,
      lng: 100.4019,
      wholeLandPrice: 18_000_000,
      description:
        "ที่ดินแบ่งแปลงจัดสรร 8 แปลง พร้อมถนนภายในโครงการและทางเข้าออกหลัก เหมาะสำหรับปลูกบ้านเดี่ยว ใกล้ถนนใหญ่และห้างสรรพสินค้า",
      saleMode: "SUBDIVISION",
      status: "PUBLISHED",
      ownerId: landowner.id,
      images: {
        create: [
          { url: "/listings/nonthaburi/photo-1.jpg", order: 0 },
          { url: "/listings/pakchong-musi/photo-3.jpg", order: 1 },
        ],
      },
    },
  });

  const nonthaburiProject = await prisma.subdivisionProject.create({
    data: {
      listingId: nonthaburi.id,
      roadCost: 600_000,
      infrastructureCost: 1_400_000,
      marketingCost: 350_000,
    },
  });

  const nonthaburiPlots: { label: string; price: number; status: "AVAILABLE" | "RESERVED" | "SOLD" }[] = [
    { label: "P1", price: 1_100_000, status: "AVAILABLE" },
    { label: "P2", price: 1_150_000, status: "AVAILABLE" },
    { label: "P3", price: 1_200_000, status: "RESERVED" },
    { label: "P4", price: 1_200_000, status: "AVAILABLE" },
    { label: "P5", price: 1_050_000, status: "SOLD" },
    { label: "P6", price: 1_100_000, status: "AVAILABLE" },
    { label: "P7", price: 1_150_000, status: "AVAILABLE" },
    { label: "P8", price: 1_250_000, status: "RESERVED" },
  ];

  const createdNonthaburiPlots = [];
  for (const p of nonthaburiPlots) {
    const plot = await prisma.plot.create({
      data: {
        projectId: nonthaburiProject.id,
        label: p.label,
        area: 100,
        width: 10,
        depth: 20,
        price: p.price,
        status: p.status,
        points: PLOT_POINTS[p.label],
        perspectiveImages: perspectiveImages(`nonthaburi-${p.label.toLowerCase()}`),
      },
    });
    createdNonthaburiPlots.push(plot);
  }

  // Bookings for reserved/sold plots
  const reservedP3 = createdNonthaburiPlots.find((p) => p.label === "P3")!;
  const reservedP8 = createdNonthaburiPlots.find((p) => p.label === "P8")!;
  const soldP5 = createdNonthaburiPlots.find((p) => p.label === "P5")!;

  await prisma.booking.create({
    data: {
      plotId: reservedP3.id,
      name: "คุณกานดา สุขใจ",
      phone: "081-234-5678",
      email: "kanda@example.com",
      message: "สนใจแปลง P3 ต้องการสอบถามเรื่องแบ่งจ่าย",
      status: "INTERESTED",
    },
  });
  await prisma.booking.create({
    data: {
      plotId: reservedP8.id,
      name: "คุณธนกร ใจดี",
      phone: "089-876-5432",
      email: "thanakorn@example.com",
      message: "ขอจองแปลง P8 ครับ",
      status: "VIEWING",
    },
  });
  await prisma.booking.create({
    data: {
      plotId: soldP5.id,
      name: "คุณมานี รักบ้าน",
      phone: "082-111-2222",
      email: "manee@example.com",
      message: "โอนเงินมัดจำเรียบร้อยแล้วค่ะ",
      status: "RESERVED",
    },
  });

  // 3. "Both" listing — Chonburi (with 8-plot project, feasibility analysis)
  const chonburi = await prisma.listing.create({
    data: {
      title: "ที่ดินติดถนนสาย 7 ใกล้นิคมอุตสาหกรรม",
      province: "ชลบุรี",
      district: "บางละมุง",
      subdistrict: "หนองปรือ",
      landArea: 6,
      lat: 12.9236,
      lng: 100.8825,
      wholeLandPrice: 30_000_000,
      description:
        "ที่ดินติดถนนใหญ่ ใกล้นิคมอุตสาหกรรมและสนามบินอู่ตะเภา สามารถขายยกแปลงหรือแบ่งขายเป็นแปลงย่อยเพื่อสร้างหมู่บ้านจัดสรรได้",
      saleMode: "BOTH",
      status: "PUBLISHED",
      ownerId: landowner.id,
      images: {
        create: [
          { url: "/listings/chonburi/photo-1.jpg", order: 0 },
          { url: "/listings/pakchong-musi/photo-1.jpg", order: 1 },
          { url: "/listings/pakchong-musi/photo-2.jpg", order: 2 },
        ],
      },
    },
  });

  const chonburiProject = await prisma.subdivisionProject.create({
    data: {
      listingId: chonburi.id,
      roadCost: 700_000,
      infrastructureCost: 1_600_000,
      marketingCost: 400_000,
    },
  });

  const chonburiPlots: { label: string; price: number; status: "AVAILABLE" | "RESERVED" | "SOLD" }[] = [
    { label: "P1", price: 1_800_000, status: "AVAILABLE" },
    { label: "P2", price: 1_850_000, status: "AVAILABLE" },
    { label: "P3", price: 1_900_000, status: "AVAILABLE" },
    { label: "P4", price: 1_900_000, status: "AVAILABLE" },
    { label: "P5", price: 1_750_000, status: "AVAILABLE" },
    { label: "P6", price: 1_800_000, status: "AVAILABLE" },
    { label: "P7", price: 1_850_000, status: "AVAILABLE" },
    { label: "P8", price: 1_950_000, status: "AVAILABLE" },
  ];

  for (const p of chonburiPlots) {
    await prisma.plot.create({
      data: {
        projectId: chonburiProject.id,
        label: p.label,
        area: 120,
        width: 12,
        depth: 20,
        price: p.price,
        status: p.status,
        points: PLOT_POINTS[p.label],
        perspectiveImages: perspectiveImages(`chonburi-${p.label.toLowerCase()}`),
      },
    });
  }

  const chonburiFeasibilityInputs = {
    landArea: chonburi.landArea,
    wholeLandPrice: chonburi.wholeLandPrice,
    wholeLandSalePrice: chonburi.wholeLandPrice,
    numberOfPlots: chonburiPlots.length,
    pricePerSqWah: 7_000,
  };
  const chonburiFeasibilityOutputs = calculateFeasibility(chonburiFeasibilityInputs);

  await prisma.feasibilityAnalysis.create({
    data: {
      listingId: chonburi.id,
      ...chonburiFeasibilityInputs,
      ...chonburiFeasibilityOutputs,
    },
  });

  // 4. Whole-land-only listing — Khon Kaen (draft, owned by landowner)
  await prisma.listing.create({
    data: {
      title: "ที่ดินเปล่าริมถนนมิตรภาพ",
      province: "ขอนแก่น",
      district: "เมืองขอนแก่น",
      subdistrict: "ในเมือง",
      landArea: 12,
      lat: 16.4419,
      lng: 102.8360,
      wholeLandPrice: 36_000_000,
      description:
        "ที่ดินแปลงใหญ่ติดถนนมิตรภาพ เหมาะสำหรับทำธุรกิจหรือพัฒนาเป็นโครงการเชิงพาณิชย์ อยู่ระหว่างเตรียมข้อมูลก่อนเผยแพร่",
      saleMode: "WHOLE",
      status: "DRAFT",
      ownerId: landowner.id,
      images: {
        create: [{ url: "/listings/pakchong-musi/photo-1.jpg", order: 0 }],
      },
    },
  });

  // 5. "Both" listing — Phuket (published, no subdivision project yet)
  const phuket = await prisma.listing.create({
    data: {
      title: "ที่ดินวิวทะเล หาดในยาง",
      province: "ภูเก็ต",
      district: "ถลาง",
      subdistrict: "สาคู",
      landArea: 4,
      lat: 8.1067,
      lng: 98.3032,
      wholeLandPrice: 48_000_000,
      description:
        "ที่ดินวิวทะเลใกล้หาดในยางและสนามบินภูเก็ต เหมาะสำหรับพัฒนาโรงแรมหรือบ้านพักตากอากาศ สามารถขายยกแปลงหรือพิจารณาแบ่งขายได้",
      saleMode: "BOTH",
      status: "PUBLISHED",
      ownerId: landowner.id,
      images: {
        create: [
          { url: "/listings/phuket/photo-1.jpg", order: 0 },
          { url: "/listings/pakchong-musi/photo-3.jpg", order: 1 },
        ],
      },
    },
  });

  // Service request for the Phuket listing
  await prisma.serviceRequest.create({
    data: {
      listingId: phuket.id,
      serviceType: "SUBDIVISION_PLANNING",
      status: "REQUESTED",
      notes: "ต้องการคำปรึกษาเรื่องการแบ่งแปลงเพื่อขายเป็นที่ดินจัดสรรริมทะเล",
    },
  });

  // 6. "Both" listing — Pak Chong, Nakhon Ratchasima (with 8-plot subdivision project)
  const pakChong = await prisma.listing.create({
    data: {
      title: "ที่ดินวิวเขาใหญ่ 5 ไร่ ติดทางหลวงท้องถิ่น ตำบลหมูสี ปากช่อง",
      province: "นครราชสีมา",
      district: "ปากช่อง",
      subdistrict: "หมูสี",
      landArea: 5,
      lat: 14.61,
      lng: 101.425,
      wholeLandPrice: 22_500_000,
      description:
        "ที่ดินเปล่าเนื้อที่ 5 ไร่ ตำบลหมูสี อำเภอปากช่อง จังหวัดนครราชสีมา ใกล้เขาใหญ่และแหล่งท่องเที่ยวไร่องุ่นชื่อดัง ที่ดินติดทางหลวงท้องถิ่นสายบ้านปุยเคย-บ้านตระน้ำใส วิวเทือกเขาโดยรอบ เหมาะสำหรับสร้างบ้านพักตากอากาศ รีสอร์ท หรือโครงการบ้านจัดสรร สามารถขายยกแปลงทั้งหมดหรือแบ่งขายเป็นแปลงย่อย 8 แปลง (A1-A8) พร้อมถนนภายในโครงการกว้าง 8 เมตร",
      saleMode: "BOTH",
      status: "PUBLISHED",
      ownerId: landowner.id,
      images: {
        create: [
          { url: "/listings/pakchong-musi/photo-1.jpg", order: 0 },
          { url: "/listings/pakchong-musi/photo-2.jpg", order: 1 },
          { url: "/listings/pakchong-musi/photo-3.jpg", order: 2 },
          { url: "/listings/pakchong-musi/subdivision-plan.png", order: 3 },
        ],
      },
    },
  });

  const pakChongProject = await prisma.subdivisionProject.create({
    data: {
      listingId: pakChong.id,
    },
  });

  const pakChongPlots: { label: string; area: number; width: number; depth: number; price: number }[] = [
    { label: "A1", area: 217, width: 22, depth: 39.5, price: 3_906_000 },
    { label: "A2", area: 203, width: 22, depth: 37, price: 3_654_000 },
    { label: "A3", area: 203, width: 22, depth: 37, price: 3_654_000 },
    { label: "A4", area: 203, width: 22, depth: 37, price: 3_654_000 },
    { label: "A5", area: 203, width: 22, depth: 37, price: 3_654_000 },
    { label: "A6", area: 203, width: 22, depth: 37, price: 3_654_000 },
    { label: "A7", area: 203, width: 22, depth: 37, price: 3_654_000 },
    { label: "A8", area: 267, width: 22, depth: 48.5, price: 4_806_000 },
  ];

  for (const p of pakChongPlots) {
    await prisma.plot.create({
      data: {
        projectId: pakChongProject.id,
        label: p.label,
        area: p.area,
        width: p.width,
        depth: p.depth,
        price: p.price,
        status: "AVAILABLE",
        points: PLOT_POINTS[p.label],
        perspectiveImages: pakChongPerspectiveImages(p.label),
      },
    });
  }

  console.log("Seed complete.");
  console.log({ buyer: buyer.email, landowner: landowner.email, admin: admin.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
