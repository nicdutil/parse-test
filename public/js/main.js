// This handles all interactions for creating a new meme
var MemeView = Backbone.View.extend({
  events: {
    "submit form": "upload",
    "keyup input[name=text1]": "render",
    "keyup input[name=text2]": "render",
    "click .choices a": "chooseMeme"
  },

  initialize: function() {
    this.canvas = this.$('canvas')[0];

    // Set up backup canvas to restore state
    var backup = $(document.createElement('canvas'));
    backup.css("display", "none");
    this.backup = backup[0];

    // Set up meme chooser
    var choice = this.$(".choices");
    var id = 0;
    
    _(TEMPLATES).each(function(template) {
      var img = $("<img />")
        .attr("src", "/images/" + template.image)
        .attr("alt", template.name)
        .attr("width", 75);

      var el = $("<a href='#'></a>")
        .append(img)
        .attr("data-id", id);
      
      el = $("<li></li>").append(el);
      
      choice.append(el);

      id += 1;
    });

    this.chooseMeme(0);
  },

  // Choose a meme template from the right column
  chooseMeme: function(id) {
    var self = this;

    // If it's the event handler, need to get id from the data field
    if (typeof id !== "number") {
      var el = id.currentTarget;
      id = parseInt($(el).attr("data-id"));
    }

    this.template = TEMPLATES[id];

    var ctx = this.canvas.getContext("2d");
    window.ctx = ctx;
    window.canvas = this.canvas;
    var img = new Image();

    img.onload = function() {
      self.canvas.width = img.width;
      self.canvas.height = img.height;
      self.template.width = img.width;
      self.template.height = img.height;

      // Adjust width of input to match image
      self.$("input[type=text]").css("width", img.width - 13);

      // Draw the image into the canvas
      ctx.drawImage(img, 0, 0, img.width, img.height);
      self.save();
      self.render();
    };

    img.src = "/images/" + this.template.image;

    return false;
  },

  // Saves the state of the canvas to a backup canvas
  save: function() {
    this.backup.width = this.canvas.width;
    this.backup.height = this.canvas.height;
    var backCtx = this.backup.getContext("2d");
    backCtx.drawImage(this.canvas, 0,0);
  },

  // Restores the state of the canvas from the backup canvas
  restore: function() {
    var ctx = this.canvas.getContext("2d");
    ctx.drawImage(this.backup, 0,0);
  },

  // Main rendering of the canvas based on input
  render: function() {
    var text1 = this.$("input[name=text1]").val().toUpperCase();
    var text2 = this.$("input[name=text2]").val().toUpperCase();

    if (text1 || text2) {
      this.restore();
      
      this.renderString(text1, "top");
      this.renderString(text2, "bottom");
    }
  },

  // Renders centered text at a vertical position
  renderString: function(string, position) {
    string = $.trim(string);
    var ctx = this.canvas.getContext("2d");

    // Vary the size based on the length of the line
    var size;
    if (string.length < 6) {
      size = 55;
    } else if (string.length < 12) {
      size = 45;
    } else {
      size = 35;
    }
    
    ctx.font = "bold " + size + "px Impact";
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';

    // Get the string split into lines of appropriate length
    var lines = this.splitLines(ctx, string);

    // Calculate the vertical positioning based on size and position of text
    var vpos;
    if (position === "top") {
      if (size === 55) {
        vpos = 75;
      } else if (size === 45) {
        vpos = 55;
      } else {
        vpos = 45;
      }
    } else {
      vpos = this.template.height - 25;
    }

    // If we're at the bottom, we need to start the line at the appropriate height
    if (position === "bottom") {
      vpos -= (size + 5) * (lines.length - 1);
    }

    // Iterate across all lines and render text evenly spaced
    _(lines).each(function(line) {
      var textWidth = ctx.measureText(line).width;
      var hpos = (this.canvas.width/2) - (textWidth / 2);
      ctx = this.canvas.getContext("2d");
      ctx.fillText(line, hpos, vpos);
      ctx.lineWidth = 2;
      ctx.strokeText(line, hpos, vpos);
      vpos += size + 5;
    });
  },

  // Given a drawing context and string, will
  // split that string into multiple lines
  // that will each fit within the width of
  // the canvas
  splitLines: function(ctx, string) {
    var textWidth = ctx.measureText(string).width;
    var lines = [];
    var TOL = 50;

    if (textWidth > this.template.width - TOL) {
      // need to split
      var words = string.split(" ");
      var width = 0;
      var i = 0;
      lines[i] = "";

      while (words.length > 0) {
        width = 0;
        
        while (width < this.template.width - TOL) {
          // Build up the line until we reach the word right before
          // it overflows
          if (!lines[i]) {
            lines[i] = "";
          }
          lines[i] += words.shift() + " ";

          if (words[0]) {
            width = ctx.measureText(lines[i] + " " + words[0]).width;
          } else {
            // No words left, we're done
            break;
          }
        }

        // Get rid of the last space
        lines[i] = lines[i].slice(0, lines[i].length - 1);
        i += 1;
      }
    } else {
      // No need to split
      lines[0] = string;
    }

    // Prune empty lines
    out = [];
    i = 0;
    _(lines).each(function(line) {
      if (line != "") {
        out[i] = lines[i];
      }
      i += 1;
    });

    return out;
  },

  reset: function() {
    this.$("button").removeAttr("disabled").text("CREATE MEME");
    this.render();
  },

  showError: function(msg) {
    this.$(".error").text(msg).show();
    this.reset();
  },

  // Uploads file using js sdk on client
  upload: function() {
    var self = this;
    var text1 = this.$("input[name=text1]").val();
    var text2 = this.$("input[name=text2]").val();

    if (text1 === "") {
      this.showError("Please fill in the Top Text");
      return false;
    }

    this.$("button").attr("disabled", "disabled").html("Creating...");

    // Serialize the canvas into base64
    var imageData = this.$("canvas")[0].toDataURL("image/jpg");
    imageData = imageData.replace(/^data:image\/(png|jpg);base64,/, "");

    var file = new Parse.File("meme.jpg", { "base64": imageData });

    // Save the file using Parse
    file.save().then(function(f) {
      var payload = {
        "url": f.url(),
        "text1": text1,
        "text2": text2
      };

      // Sending the image url and metadata to custom endpoit
      $.ajax({
        type: 'POST',
        url: '/meme',
        data: JSON.stringify(payload),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(msg) {
          window.location = msg.url;
        }, error: function(xhr, status) {
          self.showError("There was a problem with your meme. Please try again.");
        }
      });
    });

    return false;
  }
});

