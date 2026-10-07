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
import type { Class } from "@/types";
import { Pencil, Trash2, Users } from "lucide-react";

interface ClassesTableProps {
  classes: Class[];
  onEdit: (item: Class) => void;
  onDelete: (item: Class) => void;
}

/** Dense data table of classes with per-row edit and delete actions. */
export function ClassesTable({ classes, onEdit, onDelete }: ClassesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-elevated">
      <Table data-ocid="classes.table">
        <TableHeader className="bg-secondary/40">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-start text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              ناوی پۆل
            </TableHead>
            <TableHead className="text-start text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              وانە / پلە
            </TableHead>
            <TableHead className="text-end text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              ژمارەی قوتابیان
            </TableHead>
            <TableHead className="w-28 text-end text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              کردارەکان
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((item, index) => (
            <TableRow
              key={item.id.toString()}
              data-ocid={`classes.row.${index + 1}`}
              className="border-border transition-smooth hover:bg-secondary/30"
            >
              <TableCell className="font-medium text-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-glow-cyan" />
                  <span className="truncate">{item.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="border-neon-accent bg-accent/10 font-normal text-accent"
                >
                  {item.subject}
                </Badge>
              </TableCell>
              <TableCell className="text-end">
                <span className="inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {item.studentCount.toString()}
                </span>
              </TableCell>
              <TableCell className="text-end">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`دەستکاریکردنی ${item.name}`}
                    data-ocid={`classes.edit_button.${index + 1}`}
                    onClick={() => onEdit(item)}
                    className="text-muted-foreground transition-smooth hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`سڕینەوەی ${item.name}`}
                    data-ocid={`classes.delete_button.${index + 1}`}
                    onClick={() => onDelete(item)}
                    className="text-muted-foreground transition-smooth hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
