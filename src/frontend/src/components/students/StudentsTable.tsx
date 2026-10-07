import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatEnrollmentDate } from "@/lib/format";
import type { Class, Student } from "@/types";
import { Pencil, Trash2 } from "lucide-react";

interface StudentsTableProps {
  students: Student[];
  classes: Class[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentsTable({
  students,
  classes,
  onEdit,
  onDelete,
}: StudentsTableProps) {
  const classById = new Map(classes.map((item) => [item.id.toString(), item]));

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-elevated">
      <Table data-ocid="students.table">
        <TableHeader className="bg-muted/40">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-start text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              ناو
            </TableHead>
            <TableHead className="text-start text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              پۆل
            </TableHead>
            <TableHead className="text-start text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              بەرواری تۆمارکردن
            </TableHead>
            <TableHead className="text-end text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              کردارەکان
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => {
            const studentClass =
              student.classId !== undefined
                ? classById.get(student.classId.toString())
                : undefined;
            return (
              <TableRow
                key={student.id.toString()}
                data-ocid={`students.row.${index + 1}`}
                className="border-border transition-smooth hover:bg-primary/5"
              >
                <TableCell className="font-medium text-foreground">
                  {student.name}
                </TableCell>
                <TableCell>
                  {studentClass ? (
                    <Badge
                      variant="outline"
                      className="border-neon-accent bg-accent/10 text-accent-foreground"
                    >
                      {studentClass.name}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      بێ پۆل
                    </span>
                  )}
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {formatEnrollmentDate(student.enrollmentDate)}
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`دەستکاریکردنی ${student.name}`}
                      data-ocid={`students.edit_button.${index + 1}`}
                      onClick={() => onEdit(student)}
                      className="text-muted-foreground transition-smooth hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`سڕینەوەی ${student.name}`}
                      data-ocid={`students.delete_button.${index + 1}`}
                      onClick={() => onDelete(student)}
                      className="text-muted-foreground transition-smooth hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
