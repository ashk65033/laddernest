import mongoose from "mongoose"

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String },
    logoUrl: { type: String },
    location: { type: String },
    jobType: { type: String, enum: ["Full Time", "Internship", "Apprentice", "Remote"], default: "Full Time" },
    category: { type: String, enum: ["OffCampus", "WorkFromHome", "Internship"] },
    applyLink: { type: String },
    batch: { type: String },
    salary: { type: String },
    degree: { type: String },
    postedDate: { type: Date, default: Date.now },
    postedBy: { type: String },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.models.Job || mongoose.model("Job", jobSchema)
