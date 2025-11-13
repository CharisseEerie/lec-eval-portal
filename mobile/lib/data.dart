class Course {
  final String code, title, lecturer;
  final bool completed;

  Course(this.code, this.title, this.lecturer, this.completed);
}

final List<Course> mockCourses = [
  Course('PHY101', 'Physics I', 'Dr. Munji', true),
  Course('MAT201', 'Math II', 'Prof. Kariuki', false),
];