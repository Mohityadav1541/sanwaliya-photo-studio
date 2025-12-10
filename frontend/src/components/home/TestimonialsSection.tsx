import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya & Arjun Sharma",
    location: "Jaipur, Rajasthan",
    text: "Roshan captured our wedding so beautifully that every time we look at our photos, we relive those magical moments. His attention to detail and ability to capture candid emotions is truly remarkable.",
    rating: 5,
  },
  {
    name: "Neha & Vikram Patel",
    location: "Udaipur, Rajasthan",
    text: "We were blown away by the cinematic video Sanwaliya Photo Studio created. It felt like watching a Bollywood movie, but it was our love story! Highly recommend their services.",
    rating: 5,
  },
  {
    name: "Anjali & Rohit Verma",
    location: "Delhi NCR",
    text: "From our pre-wedding shoot to the final album delivery, the entire experience was seamless. Roshan and his team made us feel so comfortable in front of the camera.",
    rating: 5,
  },
  {
    name: "Meera & Sanjay Kumar",
    location: "Mumbai, Maharashtra",
    text: "The album Sanwaliya designed for us is absolutely stunning. Every page tells a story, and the quality is premium. Our families were so impressed with the work.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary tracking-widest uppercase">
            Love Stories
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mt-4 mb-6">
            What Our Couples Say
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We are honored to be part of so many beautiful love stories. Here is
            what some of our couples have to say about their experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-xl p-8 shadow-soft relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-gold-light flex items-center justify-center text-primary-foreground font-serif text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
