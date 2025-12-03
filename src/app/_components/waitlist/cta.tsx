import { motion } from "framer-motion";
import TextBlur from "@/app/_components/waitlist/text-blur";
import AnimatedShinyText from "@/app/_components/waitlist/shimmer-text";
import { containerVariants, itemVariants } from "@/lib/animation-variants";

export default function CTA() {
  return (
    <motion.div
      className="flex w-full max-w-2xl flex-col gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-center">
          <div className="flex w-fit items-center justify-center rounded-full bg-muted/80 text-center">
            <AnimatedShinyText className="px-4 py-1">
              <span>Coming soon!</span>
            </AnimatedShinyText>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mx-auto">
        <h1 className="text-5xl font-bold text-white sm:text-6xl md:text-7xl">
          standout
        </h1>
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-center text-3xl font-medium tracking-tighter sm:text-5xl"
          text="Skip the webinars. Build a real Ivy-Level Capstone — live."
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="mx-auto max-w-[27rem] pt-1.5 text-center text-base text-zinc-300 sm:text-lg"
          text="In this session, you'll build a real extracurricular project that you can submit to Harvard, Columbia, Yale, Penn, UC Berkeley & top global universities — live, step-by-step using our one of the kind systems."
          duration={0.8}
        />
      </motion.div>
    </motion.div>
  );
}




