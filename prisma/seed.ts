import { PrismaClient, TravelCategory } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

const travels = [
  { title:"Maasai Mara Safari Escape",slug:"maasai-mara-safari-escape",destination:"Maasai Mara",country:"Kenya",category:TravelCategory.SAFARI,duration:"4 Days",travelDate:new Date("2026-11-14"),price:34000,excerpt:"Big skies, wild plains and unforgettable safari moments.",description:"A carefully planned Maasai Mara experience with game drives, comfortable accommodation and the freedom to enjoy Kenya at its most iconic.",featured:true,isPast:false },
  { title:"Zanzibar Beach Getaway",slug:"zanzibar-beach-getaway",destination:"Zanzibar",country:"Tanzania",category:TravelCategory.BEACH,duration:"5 Days",travelDate:new Date("2026-12-05"),price:65000,excerpt:"Slow mornings, turquoise water and island culture.",description:"A relaxed Zanzibar escape combining beach time, Stone Town and optional spice and ocean experiences.",featured:true,isPast:false },
  { title:"Mount Kenya Sirimon Trek",slug:"mount-kenya-sirimon-trek",destination:"Mount Kenya",country:"Kenya",category:TravelCategory.HIKING,duration:"4 Days",travelDate:new Date("2026-10-24"),price:34000,excerpt:"A mountain adventure designed for hikers.",description:"A guided high-altitude trek through the Sirimon route with experienced trip leaders.",featured:true,isPast:false },
  { title:"Dubai City & Desert Holiday",slug:"dubai-city-desert-holiday",destination:"Dubai",country:"United Arab Emirates",category:TravelCategory.INTERNATIONAL,duration:"6 Days",travelDate:new Date("2027-01-16"),price:115000,excerpt:"A city break with desert adventure.",description:"A flexible Dubai package combining city highlights, shopping and a desert experience.",featured:false,isPast:false },
  { title:"Tanzania & Zanzibar Honeymoon",slug:"tanzania-zanzibar-honeymoon",destination:"Tanzania & Zanzibar",country:"Tanzania",category:TravelCategory.HONEYMOON,duration:"12 Days",travelDate:new Date("2027-02-13"),price:145000,excerpt:"Safari days and island nights.",description:"A customizable honeymoon combining wildlife, warm hospitality and a Zanzibar beach stay.",featured:true,isPast:false },
  { title:"Amboseli Weekend Escape",slug:"amboseli-weekend-escape",destination:"Amboseli",country:"Kenya",category:TravelCategory.SAFARI,duration:"3 Days",travelDate:new Date("2026-08-22"),price:28500,excerpt:"A weekend beneath the shadow of Mount Kilimanjaro.",description:"A memorable Amboseli safari with game drives, open plains and views of Kilimanjaro.",featured:false,isPast:true },
  { title:"Diani Coast Summer Escape",slug:"diani-coast-summer-escape",destination:"Diani",country:"Kenya",category:TravelCategory.BEACH,duration:"4 Days",travelDate:new Date("2026-07-18"),price:42000,excerpt:"Ocean air, warm sands and an easy coastal rhythm.",description:"A relaxed Diani getaway built around beach time, coastal dining and time to unwind.",featured:false,isPast:true },
  { title:"Naivasha Adventure Weekend",slug:"naivasha-adventure-weekend",destination:"Naivasha",country:"Kenya",category:TravelCategory.FAMILY,duration:"2 Days",travelDate:new Date("2026-05-16"),price:18500,excerpt:"A refreshing lakeside break packed with outdoor moments.",description:"A short Naivasha escape featuring nature, lakeside scenery and optional outdoor activities.",featured:false,isPast:true },
  { title:"Uganda Gorilla & Wildlife Journey",slug:"uganda-gorilla-wildlife-journey",destination:"Bwindi & Queen Elizabeth",country:"Uganda",category:TravelCategory.INTERNATIONAL,duration:"7 Days",travelDate:new Date("2026-03-12"),price:168000,excerpt:"Wildlife, forest trails and an unforgettable East African adventure.",description:"A carefully arranged Uganda journey combining wildlife viewing, forest experiences and local culture.",featured:false,isPast:true },
];

const experiences = [
  {title:"Golden Hour in the Mara",slug:"golden-hour-in-the-mara",destination:"Maasai Mara",country:"Kenya",date:new Date("2026-08-15"),excerpt:"A sunrise game drive followed by a long golden hour across the plains.",description:"One of those mornings that reminds you why we travel: quiet roads, wide-open skies and wildlife moving through the Mara.",featured:true},
  {title:"Diani Beach Days",slug:"diani-beach-days",destination:"Diani",country:"Kenya",date:new Date("2026-07-20"),excerpt:"Ocean swims, coastal sunsets and slow evenings by the Indian Ocean.",description:"A collection of moments from a coastal escape filled with warm water, good food and plenty of time to simply enjoy the coast.",featured:true},
  {title:"Summit Morning on Mount Kenya",slug:"summit-morning-on-mount-kenya",destination:"Mount Kenya",country:"Kenya",date:new Date("2026-06-08"),excerpt:"Cold mountain air, determined footsteps and an unforgettable sunrise.",description:"An early summit push rewarded the group with clear mountain views and a sunrise worth every step.",featured:false},
  {title:"Naivasha by the Lake",slug:"naivasha-by-the-lake",destination:"Naivasha",country:"Kenya",date:new Date("2026-05-17"),excerpt:"A relaxed weekend of lake views, nature and outdoor adventure.",description:"A refreshing weekend away from the city, with lakeside moments, open spaces and time spent together.",featured:false},
  {title:"Zanzibar Sunset Cruise",slug:"zanzibar-sunset-cruise",destination:"Zanzibar",country:"Tanzania",date:new Date("2026-04-25"),excerpt:"A warm island evening ending on the water as the sun went down.",description:"A beautiful Zanzibar evening spent on the water, watching the coastline change colour as the sun disappeared.",featured:true},
  {title:"Dubai After Dark",slug:"dubai-after-dark",destination:"Dubai",country:"United Arab Emirates",date:new Date("2026-03-12"),excerpt:"City lights, desert roads and a night to remember.",description:"A snapshot of an international getaway combining Dubai's energy with a memorable evening in the desert.",featured:false},
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before running the seed.");
  const salt = randomBytes(16).toString("hex");
  const passwordHash = salt + ":" + scryptSync(adminPassword, salt, 64).toString("hex");
  await prisma.admin.upsert({where:{email:adminEmail},update:{passwordHash},create:{email:adminEmail,passwordHash}});
  console.log("Admin account seeded:", adminEmail);
  for (const travel of travels) await prisma.travel.upsert({where:{slug:travel.slug},update:travel,create:travel});
  for (const experience of experiences) await prisma.experience.upsert({where:{slug:experience.slug},update:experience,create:experience});
}
main().catch((error)=>{console.error(error);process.exit(1)}).finally(async()=>{await prisma.$disconnect()});
